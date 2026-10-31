import { LazyVideo } from "../LazyVideo";
import {
  imgHero1WebmHero1Mp4,
  imgSoulVenturesAfrica,
  imgWhatsApp,
} from "./assets";
export function HeroScene() {
  return (
    <div
      className="d0000"
      data-node-id="22:211"
      data-name="01 / Видео и первый экран"
    >
      <div
        className="d0001"
        data-node-id="22:212"
        data-name="Видео / существующий hero-1.webm + hero-1.mp4"
      >
        <LazyVideo
          src="/assets/video/hero-1.mp4"
          poster={imgHero1WebmHero1Mp4}
          eager
          label="Африка в движении"
        />
      </div>
      <div
        className="d0001"
        data-node-id="22:213"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(var(--sva-forest-rgb), 0.4) 0%, rgba(var(--sva-forest-rgb), 0) 35%, rgba(var(--sva-forest-rgb), 0.85) 100%, rgba(var(--sva-forest-rgb), 0.85) 100%)",
        }}
        data-name="Затемнение для читаемости"
      />
      <div
        className="d0003"
        data-node-id="22:214"
        data-name="Header / Навигация"
      >
        <div
          className="d0004"
          data-node-id="22:215"
          data-name="Soul Ventures Africa / логотип"
        >
          <img
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className="d0005"
            src={imgSoulVenturesAfrica}
          />
        </div>
        <div className="d0006" data-node-id="22:216" data-name="Ряд">
          <a
            className="d0007"
            href="https://soulventuresafrica.ru/tours"
            data-node-id="22:217"
            target="_blank"
          >
            <p className="d0008">Индивидуальные</p>
          </a>
          <a
            className="d0007"
            href="https://soulventuresafrica.ru/grouptours"
            data-node-id="22:218"
            target="_blank"
          >
            <p className="d0008">Групповые</p>
          </a>
          <a
            className="d0007"
            href="https://soulventuresafrica.ru/about"
            data-node-id="22:219"
            target="_blank"
          >
            <p className="d0008">О нас</p>
          </a>
          <p className="d0009" data-node-id="22:220">
            Отзывы
          </p>
          <a
            className="d0007"
            href="https://soulventuresafrica.ru/blog/"
            data-node-id="22:221"
            target="_blank"
          >
            <p className="d0008">Блог</p>
          </a>
        </div>
        <div className="d0010" data-node-id="22:222" data-name="Ряд">
          <div className="d0011" data-node-id="22:223" data-name="WhatsApp">
            <img
              alt=""
              decoding="async"
              loading="eager"
              fetchPriority="high"
              className="d0005"
              src={imgWhatsApp}
            />
          </div>
          <button
            className="d0012"
            data-node-id="219:323"
            data-name="SVA / Button / Primary"
          >
            <p className="d0013" data-node-id="I219:323;22:198">
              Подобрать тур
            </p>
          </button>
          <button className="d0014" data-node-id="22:228">
            <p className="d0015">Меню ☰</p>
          </button>
        </div>
      </div>
      <div className="d0016" data-node-id="22:229" data-name="Hero / Заголовок">
        <div className="d0017" data-node-id="22:231" data-name="Отступ" />
        <div
          className="d0018"
          data-node-id="22:232"
          role="heading"
          aria-level={1}
        >
          <p className="d0019">ЛУЧШЕ ОДИН РАЗ</p>
          <p className="d0020">УВИДЕТЬ АФРИКУ САМОМУ.</p>
        </div>
      </div>
    </div>
  );
}
