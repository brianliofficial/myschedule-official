import Image from "next/image";

/** 對應 `pug/_footer.pug` */
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner-wrapper">
        <div className="logo">
          <Image src="/assets/logo.png" alt="" width={80} height={80} />
        </div>
        <div className="contact">
          <div className="mail">
            <p>santana30541@gmail.com</p>
          </div>
          <div className="phone">
            <p>+886 935 829 620</p>
          </div>
          <div className="location">
            <p>TAIPEI, TAIWAN</p>
          </div>
        </div>
        <div className="copy-right">
          <p>2023 MY SCHEDULE @ ALL RIGHT RESERVED </p>
        </div>
      </div>
    </footer>
  );
}
