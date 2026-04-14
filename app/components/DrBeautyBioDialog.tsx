"use client";

import Image from "next/image";

/** 對應 `pug/drBeauty.pug` 的 `block header`（履歷彈窗） */
type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DrBeautyBioDialog({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="drBeautyDialog on"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="drBeautyContext" onClick={(e) => e.stopPropagation()}>
        <div className="icon" onClick={onClose} role="button" tabIndex={0}>
          <div className="bi bi-plus-circle" />
        </div>
        <div className="drBeautyInnerContext">
          <div className="content-right">
            <Image src="/assets/KVN_1104-86.jpg" alt="" width={400} height={400} />
          </div>
          <div className="content">
            <h1>
              <p>美麗本人</p>
            </h1>
            <p>李包比，藝人、饒舌歌手、音樂製作人、主持人、網美、YouTuber、派對吉祥物，農曆是2月2號跟土地公同一天生。</p>
            <div className="context">
              <ul>
                <h6>經歷</h6>
                <li>
                  <p>
                    2019年開立『美麗本人』YouTube頻道，用著具有吸引力的美麗臉龐，帶著浮誇且具有幽默感的表演方式對華語歌曲MV
                    做Reaction 影片，影片製作加入動畫及特效，高品質影像呈現方式聞名，更以一句“R爆”跟經典手勢“醬擠”在年輕族群口中瘋傳成為了時下年輕人的流行用語及手勢。
                  </p>
                </li>
                <li>
                  <p>
                    2020年初受GQ台灣邀請拍攝網路專題，也是第一位被GQ台灣邀請拍攝專題的網路藝人。同年5月以演員身份擔任藝人瘦子，鬼鬼吳映潔，李浩瑋及團體沒有才能MV男主角，正式開啟演員之路。同年10月受台灣Red
                    Bull邀請，參與Swift16企劃創作歌曲『喵』。同月16日受邀至台中知名夜店18TC，參與Red Bull『TURN IT UP』活動。
                  </p>
                </li>
                <li>
                  <p>
                    2021年參加台灣第一屆嘻哈選秀節目『大嘻哈時代』海選，演唱拿手歌曲『喵』，並在表演過程中，以『筋膜槍』的振動模式按壓喉嚨，改變聲音呈現效果，其特殊表演方式讓評審立即舉牌，成為該場次首位過關選手
                  </p>
                </li>
                <li>
                  <p>
                    2022年受邀參加台灣嘻哈選秀節目『大嘻哈時代2』與阿達、嗩吶、賀瓏共同擔任該節目之主持，更與阿達擔任現場賽評一職。
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
