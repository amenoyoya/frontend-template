const nedb = require('./nedb')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')

dayjs.locale('ja')

/**
 * 暗号化
 * @param {string} text
 * @param {string} passphrase
 * @param {string} algorithm = 'aes192'
 * @return {string} crypted
 */
const encrypt = (text, passphrase, algorithm = 'aes192') => {
  const cipher = crypto.createCipher(algorithm, passphrase)
  const crypted = cipher.update(text, 'utf8', 'base64')
  return crypted + cipher.final('base64')
}

/**
 * 復号
 * @param {string} text
 * @param {string} passphrase
 * @param {string} algorithm = 'aes192'
 * @return {string} decrypted
 */
const decrypt = (text, passphrase, algorithm = 'aes192') => {
  const decipher = crypto.createDecipher(algorithm, passphrase)
  const decrypted = decipher.update(text, 'base64', 'utf8')
  return decrypted + decipher.final('utf8')
}

/**
 * generate bcrypt hash
 * plain を salt で bcrypt ハッシュ化する
 * @param {string} plain
 * @param {string|number} salt
 * @return {string} hash
 */
const hashBcrypt = (plain, salt = 10) => {
  return bcrypt.hashSync(plain, salt)
}

/**
 * verify bcrypt hash
 * plain と hash を比較する
 * @param {string} plain
 * @param {string} hash
 * @return {boolean} verified
 */
const verifyBcrypt = (plain, hash) => {
  return bcrypt.compareSync(plain, hash)
}

/**
 * save session data
 * ※ NeDB/@session.db をセッションストアとして利用
 * @param {*} savedata
 * @param {number} lifetime セッション有効期限（デフォルト: 1440秒）
 * @return {string} sessionId
 */
const saveSession = async (savedata, lifetime = 1440) => {
  const doc = await nedb('@session').insert({
    // データは暗号化した上で保存
    data: encrypt(JSON.stringify(savedata), '@session.encrypt'),
    // セッション有効期限: now + lifetime
    expires: dayjs().add(lifetime, 'second').format(),
  })
  // DBデータID（セッションID）を返す
  return doc._id
}

/**
 * load session data
 * ※ NeDB/@session.db をセッションストアとして利用
 * @param {string} id セッションID
 * @return {*} savedData
 */
const loadSession = async (id) => {
  // @session._id = セッションID のデータ取得
  const docs = await nedb('@session').find({_id: id})
  if (docs.length === 0) {
    throw new Error('session expired')
  }
  // 有効期限切れのセッションなら削除して終了
  const doc = docs[0]
  if (dayjs(doc.expires) <= dayjs()) {
    await nedb('@session').remove({_id: id})
    throw new Error('session expired')
  }
  // セッションデータを復号 => JSON化して返す
  return JSON.parse(decrypt(doc.data, '@session.encrypt'))
}

/**
 * clear session data
 * ※ NeDB/@session.db をセッションストアとして利用
 * @param {string} id セッションID
 */
const clearSession = async (id) => {
  // @session._id = セッションID のデータ削除
  await nedb('@session').remove({_id: id})
}

// export
module.exports = {
  encrypt, decrypt,
  hashBcrypt, verifyBcrypt,
  saveSession, loadSession, clearSession,
}