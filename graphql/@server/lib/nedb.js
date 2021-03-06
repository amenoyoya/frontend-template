const nedb = require('nedb-promises')
const fs = require('fs')
const omit = require('./omit')

const databases = {}

/**
 * ファイル存在判定
 * @param {string} filename 
 * @return {boolean}
 */
const isFile = filename => {
  try {
    return fs.statSync(filename).isFile()
  } catch {
    return false
  }
}

/**
 * NeDBコレクション作成
 * @param {string} name [a-zA-Z0-9\-_#$@] のみ許可
 * @param {string} mode 'delete' ならコレクション削除
 * @return {object}
 */
module.exports = (name, mode = 'open') => {
  if (!name.match(/[a-z0-9\-_#$@]+/i)) {
    throw new Error('NeDB collection name allowed chars: [a-z][A-Z][1-9]-_')
  }
  // コレクション削除
  if (mode === 'delete') {
    if (isFile(`./nedb/${name}.db`)) {
      fs.unlinkSync(`./nedb/${name}.db`)
      return {
        result: true
      }
    }
    return {
      result: false
    }
  }
  // コレクション作成
  const filename = `./nedb/${name}.db`
  const db = databases[filename] || new nedb({filename, autoload: true})
  databases[filename] = db
  // cursor 共通メソッド: sort, limit, skip
  const sort_limit_skip = (cursor, condition) => {
    if (typeof condition === 'object' && typeof condition['$sort'] === 'object') {
      cursor = cursor.sort(condition['$sort'])
    }
    if (typeof condition === 'object' && typeof condition['$limit'] === 'number') {
      cursor = cursor.limit(condition['$limit'])
    }
    if (typeof condition === 'object' && typeof condition['$skip'] === 'number') {
      cursor = cursor.skip(condition['$skip'])
    }
    return cursor
  }
  return {
    /**
     * findメソッド
     * @param {[search_key]: object, $sort: object, $limit: number, $skip: number} condition
     *    @see https://github.com/louischatriot/nedb#finding-documents
     * @return {object[]} docs
     */
    async find(condition) {
      // $sort, $limit, $skip キーを除く検索条件
      const query = omit(condition, ['$sort', '$limit', '$skip'])
      return await sort_limit_skip(db.find(query), condition).exec()
    },

    /**
     * countメソッド
     * @param {object} condition
     * @return {number} count
     */
    async count(condition) {
      // $sort, $limit, $skip キーを除く検索条件
      const query = omit(condition, ['$sort', '$limit', '$skip'])
      return await sort_limit_skip(db.count(query), condition).exec()
    },

    /**
     * paginateメソッド
     * @param {object} condition 
     * @param {number} page = 1
     * @param {number} perPage = 50
     * @return {count, data, start, end, page, prev, next, last}
     */
    async paginate(condition, page = 1, perPage = 50) {
      page = page < 1? 1: page
      
      // $sort, $limit, $skip, $page, $per キーを除く検索条件
      const query = omit(condition, ['$sort', '$limit', '$skip', '$page', '$per'])
      const count = await db.count(query).exec()
      const last = Math.ceil(count / perPage)
      
      page = page > last? last: page
      
      const start = count > 0? (page - 1) * perPage: 0
      let find = db.find(query).limit(perPage).skip(start)
      if (typeof condition['$sort'] === 'object') {
        find = find.sort(condition['$sort'])
      }
      const data = await find.exec()
      return {
        page,
        count,
        data,
        start: count > 0? start + 1: 0,
        end: start + data.length,
        last,
        prev: page > 1? page - 1: false,
        next: page < last? page + 1: false,
      }
    },

    /**
     * insertメソッド
     * @param {object|object[]} docs
     * @param {boolean} withId RDBS のように incremental id を付与するか
     * @return {object|object[]} inserted
     */
    async insert(docs, withId = true) {
      if (withId) {
        // ドキュメント中最大のIDを取得
        const documents = await db.find({}).sort({id: -1}).limit(1).exec()
        let maxid = documents.length === 1? (documents[0].id || 0): 0
        if (Array.isArray(docs)) {
          const results = []
          for (const doc of docs) {
            results.push(await db.insert({...doc, id: ++maxid}))
          }
          return results
        }
        return await db.insert({...docs, id: ++maxid})
      }
      return await db.insert(docs)
    },

    /**
     * updateメソッド
     * @param {object} condition 
     * @param {object} updateDoc 指定カラムのみ更新したい場合は {$set: {column: value}}
     * @return {number} updated
     */
    async update(condition, updateDoc) {
      return await db.update(condition, updateDoc, {multi: true})
    },

    /**
     * removeメソッド
     * @param {object} condition 
     * @return {number} removed
     */
    async remove(condition) {
      return await db.remove(condition, {multi: true})
    },
  }
}
