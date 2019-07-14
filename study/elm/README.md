# Elm

## What's Elm?

- Elm は JavaScript にコンパイルできる関数型プログラミング言語
- Redux(FluxベースのReactJS用UIフレームワーク)の元になった言語
- Elm はシンプルであること、簡単に使えること、高品質であることを大切にする
- 根底にある考え方や方針に納得できる一部の人たちが最高に満足できるものを目指す
- Elm は汎用言語ではなく、The Elm Architecture というフレームワークの DSL (ドメイン固有言語) の一種と考えられる
    - 徹底して「高品質なWebアプリケーションをつくりやすくする」という目的を達成することを起点にして設計されている

### Reference
- [Elm公式ガイド](https://guide.elm-lang.jp/)
- [Elmはどんな人にオススメできないか](https://qiita.com/arowM/items/dfb38d1c5f3dfde8b8bf)
- [ElmとPureScript、どっちを選べばいいんだよ](https://qiita.com/hiruberuto/items/c65e7629d3b1597840d9)

***

## Setup

### Environment
- CLI:
    - nodejs: `10.15.3`
    - yarn (package manager): `1.15.2`

---

### Installation
```bash
$ yarn add -D elm
```

#### If on Windows
- Edit **package.json** if on windows
    ```diff
    {
        // ...
    +   "scripts": {
    +       "elm": "node_modules/elm/bin/elm.exe"
    +   }
    }
    ```

---

### Test run

#### REPL
```bash
# run elm repl mode
$ yarn elm repl
---- Elm 0.19.0 ----------------------------------------------------------------
Read <https://elm-lang.org/0.19.0/repl> to learn more: exit, help, imports, etc.
--------------------------------------------------------------------------------
# 1 / 2 => 0.5
> 1 / 2
0.5 : Float

# exit
> :exit
```

#### Development Server
- First, initialize elm project
    ```bash
    $ yarn elm init
    Knowing all that, would you like me to create an elm.json file now? [Y/n]: # <= `y`
    ## => Generate `elm.json`
    ```
- Create test script: **test.elm**
    ```elm
    import Html
    -- main function: display html text "Hello, world!"
    main = Html.text "Hello, world!"
    ```
- Run elm development server
    ```bash
    $ yarn elm reactor
    ## => Development Server will run in http://localhost:8000
    
    # Access to http://localhost:8000/test.elm
    ## => Display: "Hello, world!"
    ```
