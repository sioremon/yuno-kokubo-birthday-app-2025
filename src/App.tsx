import { useEffect, useState, useRef,useCallback } from 'react'
import card1 from './assets/2024_message_card.jpg'
import {Stage, Layer, Image, Text} from 'react-konva'
import useImage from 'use-image'
import { useWindowSize } from 'react-use'
import Konva from 'konva'
import './App.css'

function App() {
  const BASE_SIZE = 1280
  const LINE_LENGTH = 19

  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [stageSize, setStageSize] = useState(0)
  const divRef = useRef<HTMLDivElement>(null)
  const {width} = useWindowSize()
  const [messagePosition, setMessagePosition] = useState({ x: stageSize, y: stageSize});
  const [namePosition, setNamePosition] = useState({ x: stageSize, y: stageSize});
  const stageRef = useRef<Konva.Stage>(null)
  const [isValidLineLength, setIsValidLineLength] = useState(true)
  const [messageFontSize, setMessageFontSize] = useState(60)
  const [nameFontSize, setNameFontSize] = useState(40)
  const stageCssClass = `items-center max-w-[${BASE_SIZE}] mb-9`

  // メッセージカードのフォントサイズを変更する関数
  const onMessageFontSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>)=>{
    setMessageFontSize(Number(e.target.value))
  },[])

  // 名前のフォントサイズを変更する関数
  const onNameFontSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>)=>{
    setNameFontSize(Number(e.target.value))
  }, [])

  // テキストエリアに入力されたテキストを読み取り, メッセージカードのテキストを更新する関数
  const triggerOnChangeEvent = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>)=>{
    console.log(e.target.value)
    setMessage(e.target.value)
  }, [])
    // messageの状態管理をuseEffectで行う
  useEffect(() => {
    if (!isValidTextLength(message)) {
      setIsValidLineLength(false);      
    } else {
      setIsValidLineLength(true);
    }
  }, [isValidLineLength, message]);
  // メッセージカードをダウンロードする関数
  const download = useCallback(() => {
    if (!stageRef.current) {
      return;
    }
    const link = document.createElement("a");
    link.download = `${name}.png`;
    // 原寸大でダウンロードする
    link.href = stageRef.current.toDataURL({ pixelRatio: Math.pow((stageRef.current.width()/BASE_SIZE),-1) });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stageRef,BASE_SIZE,name]);


  // 入力されたテキストを読み取り, 1行あたりの文字数をカウントし, 18文字以上の行があればfalseを返す
  const isValidTextLength=(text: string)=> {
    // 1行あたりの文字数をカウントする
    const lines = text.split('\n');
    // スプレッド演算子で配列を展開し, 1行あたりの文字数をカウントする
    const lineLengths = lines.map((line) => line.length);
    return lineLengths.every((lineLength) => lineLength <= LINE_LENGTH);
  }

  // ドラッグ操作の境界を画像内に制限する関数
  const messageDragBound = (pos: Konva.Vector2d): Konva.Vector2d => {
      // posが0以上かつ画像を越えないならposを返す
      if (!stageRef.current) {
        return pos;
      }
      // console.log(stageRef.current.width(), stageRef.current.height());
      const x = Math.max(0, Math.min(stageRef.current.width() - messageFontSize, pos.x));
      const y = Math.max(0, Math.min(stageRef.current.height() - messageFontSize, pos.y));
      console.log(x, y);
      return { x, y };
    }
  const nameDragBound = (pos: Konva.Vector2d): Konva.Vector2d => {
    // posが0以上かつ画像を越えないならposを返す
    if (!stageRef.current) {
      return pos;
    }
    // console.log(stageRef.current.width(), stageRef.current.height());
    const x = Math.max(0, Math.min(stageRef.current.width() - nameFontSize, pos.x));
    const y = Math.max(0, Math.min(stageRef.current.height() - nameFontSize, pos.y));
    console.log(x, y);
    return { x, y };
  }
  // カードの画像を読み込む関数
  const Card = () =>{ // Rename 'card' to 'Card'
    const [img] = useImage(card1) // Change type of 'img' to 'HTMLImageElement | undefined'

    return <Image image={img} />
  }

  // メッセージの改行の数をカウントする関数
  const countLineBreaks = (text: string) => {
    return text.split('\n').length - 1;
  }

  const lineLengthAlert = () => {
    if (!isValidLineLength) {
      return (
      <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">1行が長すぎます！</span> 1行は{LINE_LENGTH}文字以内にしてください
        </div>
      </div>)
    }
  }

  useEffect(() => {
    if (divRef.current){

      setStageSize(divRef.current.clientWidth);
    }
  }, [width]);

  const scale = stageSize / BASE_SIZE;


  return (
    <>
    <div ref={divRef} className="items-center  p-4" >
      <h1 className='text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-6'>中山莉子生誕企画 メッセージカード</h1>
      <div className='mb-16'>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl  mb-6 text-red-500'>端末によっては文字が期待通りに表示されない場合があります.(修正中)</p>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6'>推奨ブラウザはChromeです. Safari上では期待通りに動作しない可能性があります. </p>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6'>メッセージは100文字まで入力できます</p>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6'>1行17文字を目安に改行してください(40pxの場合)</p>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6'>絵文字は非推奨です. </p>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6'>表示された文字は画像の中で動かすことができます</p>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6'>メッセージを書き終わったらページ下部のダウンロードボタンを押してダウンロードしてください</p>
      </div>
      <div className='mb-11'>
        <button onClick={download} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>画像をダウンロード</span>
        </button>
      </div>
      <div className={stageCssClass}>
        <Stage 
          width={stageSize} 
          height={stageSize} 
          ref={stageRef} 
          scaleX={scale} 
          scaleY={scale}
        >
            <Layer>
            {Card()}
            <Text
                text={message}
                fontSize={messageFontSize}
                fill="#21A0DB"
                fontFamily="uzura"
                x={messagePosition.x}
                y={messagePosition.y}
                width={message.length * messageFontSize}
                height={messageFontSize * (countLineBreaks(message)+2)}
                draggable={true}
                dragBoundFunc={messageDragBound}
                onDragMove={(e) => {
                  setMessagePosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              />
              <Text
                text={name}
                fontSize={nameFontSize}
                fill="#21A0DB"
                fontFamily="uzura"
                x={namePosition.x}
                y={namePosition.y}
                width={name.length * nameFontSize}
                height={nameFontSize * (countLineBreaks(name)+2)}
                draggable={true}
                dragBoundFunc={nameDragBound}
                onDragMove={(e) => {
                  setNamePosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block mb-4 text-3xl font-medium text-gray-900 dark:text-white">名前を入力</label>
        <textarea onChange={(e) => setName(e.target.value)} maxLength={45} id='nameTextArea' 
        rows={1}
        className="
          mb-9
          block 
          p-2.5 
          w-full 
          text-base 
          sm:text-sm 
          md:text-xl 
          lg:text-2xl 
          xl:text-3xl
          text-gray-900 
          bg-transparent 
          rounded-lg 
          border 
          border-gray-300 
          focus:ring-blue-500 
          focus:border-blue-500 
          dark:bg-gray-700 
          dark:border-gray-600 
          dark:placeholder-gray-400 
          dark:text-white 
          dark:focus:ring-blue-500 
          dark:focus:border-blue-500
        " 
        placeholder="名前を入力"></textarea>


        <label htmlFor="message" className="block mb-4 text-3xl font-medium text-gray-900 dark:text-white">文字サイズ</label>
        <form className="max-w-sm mx-auto">
          <select onChange={onNameFontSizeChange} value={nameFontSize} 
            className="
            mb-24 
            bg-gray-50 
            border 
            border-gray-300 
            text-gray-900 
            text-base 
            sm:text-sm 
            md:text-xl 
            lg:text-2xl 
            xl:text-3xl
            rounded-lg 
            focus:ring-blue-500 
            focus:border-blue-500 
            block 
            w-full 
            p-2.5 
            dark:bg-gray-700 
            dark:border-gray-600 
            dark:placeholder-gray-400 
            dark:text-white 
            dark:focus:ring-blue-500 
            dark:focus:border-blue-500
          ">
            <option value="20">20px</option>
            <option value="25">25px</option>
            <option value="30">30px</option>
            <option value="35">35px</option>
            <option value="40">40px</option>
            <option value="45">45px</option>
            <option value="50">50px</option>
            <option value="55">55px</option>
            <option value="60">60px</option>
          </select>
        </form>
          <div>
            <label htmlFor="message" className="block mb-6 text-3xl font-medium text-gray-900 dark:text-white">メッセージを入力</label>

            <textarea onChange={triggerOnChangeEvent} maxLength={110} id='messageTextArea' rows={8}
              className="
              mb-9
              block 
              p-2.5 
              w-full 
              text-base 
              sm:text-sm 
              md:text-xl 
              lg:text-2xl 
              xl:text-3xl
              text-gray-900 
              bg-transparent 
              rounded-lg 
              border 
              border-gray-300 
              focus:ring-blue-500 
              focus:border-blue-500 
              dark:bg-gray-700 
              dark:border-gray-600 
              dark:placeholder-gray-400 
              dark:text-white 
              dark:focus:ring-blue-500 
              dark:focus:border-blue-500
            " 
            placeholder="メッセージを入力"></textarea>

            {!isValidLineLength && lineLengthAlert()}

            <label htmlFor="message" className="block mb-6 text-3xl font-medium text-gray-900 dark:text-white">文字サイズ</label>
            <form className="max-w-sm mx-auto">
              <select onChange={onMessageFontSizeChange} value={messageFontSize} 
              className="
                mb-24 
                bg-gray-50 
                border 
                border-gray-300 
                text-gray-900 
                text-base 
                sm:text-sm 
                md:text-xl 
                lg:text-2xl 
                xl:text-3xl
                rounded-lg 
                focus:ring-blue-500 
                focus:border-blue-500 
                block 
                w-full 
                p-2.5 
                dark:bg-gray-700 
                dark:border-gray-600 
                dark:placeholder-gray-400 
                dark:text-white 
                dark:focus:ring-blue-500 
                dark:focus:border-blue-500
              ">
                <option value="40">40px</option>
                <option value="45">45px</option>
                <option value="50">50px</option>
                <option value="55">55px</option>
                <option value="60">60px</option>
                <option value="65">65px</option>
                <option value="70">70px</option>
                <option value="75">75px</option>
                <option value="80">80px</option>
                <option value="85">85px</option>
                <option value="90">90px</option>
                <option value="95">95px</option>
                <option value="100">100px</option>
                <option value="105">105px</option>
                <option value="110">110px</option>
                <option value="115">115px</option>
                <option value="120">120px</option>
              </select>
            </form>
          </div>

        {/* <button onClick={download} className='"bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 border border-blue-500 rounded-full dark:text-white"'>ダウンロード!</button> */}
      </div>
      <div>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl'>このページは私立恵比寿中学のファン有志によって作成されました. 私立恵比寿中学公式とは無関係です</p>
        <p className='text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl'>Contact</p>
        <ul>
          <li>GitHub: <a href="https://github.com/sioremon">@sioremon</a></li>
          <li>Mail: <a href="mailto:sioremon@sioremon.dev">sioremon [at] sioremon.dev</a></li>
          <li>Repository: <a href="https://github.com/sioremon/instagram-birthday-event-demo-app">sioremon/instagram-birthday-event-demo-app</a></li>
        </ul>
      </div>
    </>
  )
}

export default App
