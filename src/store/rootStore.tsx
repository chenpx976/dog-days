import { createContext, useContext } from 'react'
// import { deepParseJson } from 'deep-parse-json'
import { makeAutoObservable } from 'mobx'
import localForage from 'localforage'
import JSONbig from 'json-bigint'

const isNumString = (str) => !isNaN(Number(str))
function deepParseJson(jsonString) {
  // if not stringified json rather a simple string value then JSON.parse will throw error
  // otherwise continue recursion
  if (typeof jsonString === 'string') {
    if (isNumString(jsonString)) {
      // if a numeric string is received, return itself
      // otherwise JSON.parse will convert it to a number
      return jsonString
    }
    try {
      return deepParseJson(JSONbig.parse(jsonString))
    } catch (err) {
      return jsonString
    }
  } else if (Array.isArray(jsonString)) {
    // if an array is received, map over the array and deepParse each value
    return jsonString.map((val) => deepParseJson(val))
  } else if (typeof jsonString === 'object' && jsonString !== null) {
    // if an object is received then deepParse each element in the object
    // typeof null returns 'object' too, so we have to eliminate that
    return Object.keys(jsonString).reduce((obj, key) => {
      const val = jsonString[key]
      obj[key] = isNumString(val) ? val : deepParseJson(val)
      return obj
    }, {})
  } else {
    // otherwise return whatever was received
    return jsonString
  }
}
import {
  makePersistable
  // clearPersistedStore,
  // getPersistedStore,
  // stopPersisting,
  // isHydrated,
  // isPersisting,
  // hydrateStore,
  // startPersisting,
  // pausePersisting
} from 'mobx-persist-store'
import { safelyJSONParse } from '@src/utils'

class RootStore {
  inputJsonValue = ''
  constructor() {
    makeAutoObservable(this)

    makePersistable(this, {
      name: 'SampleStore',
      properties: ['inputJsonValue'],
      storage: localForage
    })
  }
  get hasParsedJsonValue() {
    return JSON.stringify(deepParseJson(safelyJSONParse(this.inputJsonValue)), null, 2)
  }
  handleInputJsonChange = (value) => {
    this.inputJsonValue = value
  }
}

export const rootStore = new RootStore()

export const StoreContext = createContext<RootStore>(rootStore)

export const useStore = () => useContext(StoreContext)

export default useStore
