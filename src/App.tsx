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

  

  useEffect(() => {
    if (divRef.current){
      
      setStageSize(divRef.current.clientWidth);
    }
  }, [width]);
  
  const scale = stageSize / BASE_SIZE;
  

  return (
    <>
    <div ref={divRef}>
      <h1>中山莉子生誕企画 メッセージカード</h1>
      <p id="proto-notice">端末によっては文字が期待通りに表示されない場合があります.(修正中)</p>
      <p>推奨ブラウザはChromeです. Safari上では期待通りに動作しない可能性があります. </p>
      <p>莉子ちゃんの生誕企画のメッセージカードを作成できます!</p>
      <p>メッセージは100文字まで入力できます</p>
      <p>1行17文字を目安に改行してください(40pxの場合)</p>
      <p>絵文字は非推奨です. </p>
      <p>表示された文字は画像の中で動かすことができます</p>
      <p>メッセージを書き終わったらページ下部のダウンロードボタンを押してダウンロードしてください</p>
      
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
              fill="black"
              fontFamily="uzura"
              x={messagePosition.x}
              y={messagePosition.y}
              width={message.length * messageFontSize}
              height={messageFontSize}
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
              fill="black"
              fontFamily="uzura"
              x={namePosition.x}
              y={namePosition.y}
              width={name.length * nameFontSize}
              height={nameFontSize}
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
      <div className="card">
        <h2>名前を入力してください</h2>
        <textarea onChange={(e) => setName(e.target.value)} maxLength={45}></textarea>
        <h2>名前のフォントサイズを選択してください</h2>
        <select onChange={onNameFontSizeChange} value={nameFontSize}>
          <option value="20">20px</option>
          <option value="30">30px</option>
          <option value="35">35px</option>
          <option value="40">40px</option>
          <option value="45">45px</option>
          <option value="50">50px</option>
          <option value="55">55px</option>
          <option value="60">60px</option>
          <option value="70">70px</option>
          <option value="80">80px</option>
          {/* <option value="90">90px</option> */}
          {/* <option value="100">100px</option> */}
        </select>
        <h2>メッセージを入力してください</h2>
        <textarea onChange={triggerOnChangeEvent} maxLength={110}></textarea>
        {!isValidLineLength && <p id="warn">(60pxの場合)1行は{LINE_LENGTH}文字以内にしてください</p>}
        <h2>メッセージのフォントサイズを選択してください</h2>
        <select onChange={onMessageFontSizeChange} value={messageFontSize}>
          <option value="40">40px</option>
          <option value="45">45px</option>
          <option value="50">50px</option>
          <option value="55">55px</option>
          <option value="60">60px</option>
          <option value="70">70px</option>
          <option value="80">80px</option>
          <option value="90">90px</option>
        </select>
        <p><button onClick={download}>ダウンロード!</button></p>
      </div>
      <div>
        <p id="notice">このページは私立恵比寿中学のファン有志によって作成されました. 私立恵比寿中学公式とは無関係です</p>
        <p>Contact</p>
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
