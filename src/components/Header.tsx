import React, { useState } from 'react';

interface Props {
  lineLength: number;
}

export const Head: React.FC<Props> = () => {
  const [openStates, setOpenStates] = useState({
    notice: false,
    usage: false,
    download: false,
  });

  const toggleOpenState = (key: keyof typeof openStates) => {
    setOpenStates({ ...openStates, [key]: !openStates[key] });
  };

  return (
    <>
      <h1 className="text-base sm:text-base md:text-xl lg:text-3xl break-all mb-6">
        小久保柚乃 生誕企画 メッセージカード
      </h1>
      <div className="mb-16">
        {/* 使い方 */}
        <div className="mb-4">
          <div
            className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md cursor-pointer"
            onClick={() => toggleOpenState('usage')}
          >
            <div className="text-center w-full">
              <p className="text-base sm:text-sm md:text-base lg:text-xl xl:text-2xl">使い方</p>
            </div>
            <svg
              className={`w-4 h-4 transition-transform transform ${openStates.notice ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {openStates.usage && (
            <div className="text-base sm:text-base md:text-xl lg:text-2xl xl:text-3xl mt-2">
              <ul className="list-disc list-outside pl-5">
                <li className="text-base mt-5">1. メッセージカードを選択します。</li>
                <li className="text-base mt-5">2. 名前を入力し、名前の文字サイズと文字色を選択します。</li>
                <li className="text-base mt-5">3. メッセージを入力し、メッセージの文字サイズと文字色を選択します。</li>
                <li className="text-base mt-5">4. 名前とメッセージの位置を調整します。</li>
                <li className="text-base mt-5">5. 画像をダウンロードします。</li>
              </ul>
            </div>
          )}
        </div>
        {/* 注意事項 */}
        <div className="mb-4">
          <div
            className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md cursor-pointer"
            onClick={() => toggleOpenState('notice')}
          >
            <div className="text-center w-full">
              <p className="text-base sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-red-500">注意事項</p>
            </div>
            <svg
              className={`w-4 h-4 transition-transform transform ${openStates.notice ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {openStates.notice && (
            <div className="text-base sm:text-base md:text-xl lg:text-2xl xl:text-3xl mt-2">
              <ul className="list-disc list-outside pl-5">
                <li className="text-base mt-5">推奨ブラウザ: Chrome (Safari上では正常に動作しない可能性があります)</li>
                <li className="text-base mt-5">メッセージは100文字まで入力できます</li>
                <li className="text-base mt-5">絵文字は非推奨です</li>
              </ul>
            </div>
          )}
        </div>
        {/* ダウンロード方法 */}
        <div>
          <div
            className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md cursor-pointer"
            onClick={() => toggleOpenState('download')}
          >
            <div className="text-center w-full">
              <p className="text-base sm:text-base md:text-xl lg:text-2xl xl:text-3xl">ダウンロード方法</p>
            </div>
            <svg
              className={`w-4 h-4 transition-transform transform ${openStates.download ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {openStates.download && (
            <ul>
              <li className="text-base">
                メッセージを書き終わったらダウンロードボタンを押してダウンロードしてください
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
