'use client'

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Note {
  category_id: string
  content: string
  updated_at: string
}

const DB_NAME = 'protocol-notes'
const DB_VERSION = 1
const STORE_CATEGORIES = 'categories'
const STORE_NOTES = 'notes'

let dbPromise: Promise<IDBDatabase> | null = null

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB not available'))
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
        db.createObjectStore(STORE_CATEGORIES, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        db.createObjectStore(STORE_NOTES, { keyPath: 'category_id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to open DB'))
  })

  return dbPromise
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB error'))
  })
}

export async function getCategories(): Promise<Category[]> {
  const db = await openDb()
  const tx = db.transaction(STORE_CATEGORIES, 'readonly')
  const store = tx.objectStore(STORE_CATEGORIES)
  const result = await requestToPromise<Category[]>(store.getAll())
  return (result ?? []).sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export async function getCategory(categoryId: string): Promise<Category | null> {
  const db = await openDb()
  const tx = db.transaction(STORE_CATEGORIES, 'readonly')
  const store = tx.objectStore(STORE_CATEGORIES)
  const result = await requestToPromise<Category | undefined>(store.get(categoryId))
  return result ?? null
}

export async function createCategory(name: string): Promise<Category> {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Category name is required')

  const category: Category = {
    id: createId(),
    name: trimmed,
    created_at: new Date().toISOString(),
  }

  const db = await openDb()
  const tx = db.transaction(STORE_CATEGORIES, 'readwrite')
  const store = tx.objectStore(STORE_CATEGORIES)
  await requestToPromise(store.add(category))
  return category
}

export async function renameCategory(categoryId: string, newName: string): Promise<Category> {
  const trimmed = newName.trim()
  if (!trimmed) throw new Error('Category name is required')

  const existing = await getCategory(categoryId)
  if (!existing) throw new Error('Category not found')

  const updated: Category = { ...existing, name: trimmed }

  const db = await openDb()
  const tx = db.transaction(STORE_CATEGORIES, 'readwrite')
  const store = tx.objectStore(STORE_CATEGORIES)
  await requestToPromise(store.put(updated))
  return updated
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_CATEGORIES, STORE_NOTES], 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Failed to delete category'))
    tx.objectStore(STORE_CATEGORIES).delete(categoryId)
    tx.objectStore(STORE_NOTES).delete(categoryId)
  })
}

export async function getNote(categoryId: string): Promise<Note | null> {
  const db = await openDb()
  const tx = db.transaction(STORE_NOTES, 'readonly')
  const store = tx.objectStore(STORE_NOTES)
  const result = await requestToPromise<Note | undefined>(store.get(categoryId))
  return result ?? null
}

export async function saveNote(categoryId: string, content: string): Promise<Note> {
  const note: Note = {
    category_id: categoryId,
    content,
    updated_at: new Date().toISOString(),
  }

  const db = await openDb()
  const tx = db.transaction(STORE_NOTES, 'readwrite')
  const store = tx.objectStore(STORE_NOTES)
  await requestToPromise(store.put(note))
  return note
}
