const {gql} = require('apollo-server')

/**
 * Schema（Graphデータの設計図）の構築
 * 
 * Schema はクライアントとその背後にあるサービスの間に存在するので、
 * フロントエンドチームとバックエンドチームが協業する際の中間地点として機能する
 * 
 * 今回作成するアプリを作るために必要となるSchema
 * - 今後のロケット発射予定を全てフェッチ
 * - 特定の発射予定を ID で指定してフェッチ
 * - 特定のユーザーとしてログイン
 * - ユーザーがログインしている場合に宇宙旅行を予約
 * - ユーザーがログインしている場合に宇宙旅行をキャンセル
 */
module.exports = gql`
# Query: どのようなデータがフェッチできるかを定義
type Query {
  # launches: 今後のロケット発射予定を全てフェッチ
  ## 後ろに ! を付けると、NULLを不許可にできる（ただし NULL と空配列は別のもの）
  launches: [Launch]!

  # launch: 特定の発射予定を ID で指定してフェッチ
  launch(id: ID!): Launch

  # me: ログイン中のユーザ情報をフェッチ
  me: User
}

# -------------------------------------------------------

# Launchデータ: ロケットの発射予定
type Launch {
  id: ID!            # id: not null
  site: String       # 発射場所
  mission: Mission   # ミッション情報
  rocket: Rocket     # ロケット情報
  isBooked: Boolean! # 予約状況: not null, true=予約済み, false=未予約
}

# Rocketデータ: ロケット情報
type Rocket {
  id: ID!      # id: not null
  name: String # ロケット名
  type: String # 種類
}

# Userデータ: 会員情報
type User {
  id: ID!          # id: not null
  email: String!   # e-mailアドレス: not null
  trips: [Launch]! # ロケットの発射予定: not null
}

# Missionデータ: ミッション情報
type Mission {
  name: String # ミッション名
  
  # PatchSize列挙体 => 文字列変換: ミッションパッチ情報取得
  missionPatch(size: PatchSize): String
}

# PatchSize列挙体: ミッションパッチの大きさ
enum PatchSize {
  SMALL
  LARGE
}

# -------------------------------------------------------

# Mutation: データを変更するためのGraphの入口を定義
type Mutation {
  # 発射予定を追加: 追加する発射予定ID配列 => 発射予定更新結果
  bookTrips(launchIds: [ID]!): TripUpdateResponse!

  # 発射予定を削除: 削除する発射予定ID配列 => 発射予定更新結果
  cancelTrips(launchIds: [ID]!): TripUpdateResponse!

  # 会員ログイン: email => ログイントークン
  login(email: String): String
}

# -------------------------------------------------------

# TripUpdateResponseデータ: 発射予定更新結果
type TripUpdateResponse {
  success: Boolean!  # 成功／失敗: not null
  message: String    # メッセージ
  launches: [Launch] # 更新後の発射予定配列
}
`