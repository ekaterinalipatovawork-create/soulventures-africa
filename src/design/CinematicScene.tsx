import { LazyVideo } from "../LazyVideo";
import {
  imgAutoplayMutedLoopPlaysinline,
  imgDoodle,
  imgDoodle1,
} from "./assets";
export function CinematicScene() {
  return (
    <div
      className="d0069"
      data-node-id="22:254"
      data-name="03 / В своём ритме / Cinematic desktop"
    >
      <div
        className="d0070"
        data-node-id="54:264"
        data-name="Заголовок / Видео вместо слова «посмотреть»"
      >
        <div
          className="d0071"
          data-node-id="54:265"
          data-name="НЕ ПРОСТО [ВИДЕО] АФРИКУ."
        >
          <p className="d0072" data-node-id="54:266">
            ОКЕАН
          </p>
          <div
            className="d0073"
            data-node-id="54:267"
            data-name="Видео внутри заголовка / Дельфины / autoplay muted loop playsinline"
          >
            <LazyVideo
              src="/assets/video/dolphins.mp4"
              poster={imgAutoplayMutedLoopPlaysinline}
              label="Дельфины в Индийском океане"
            />
          </div>
          <p className="d0072" data-node-id="54:268">
            И САФАРИ
          </p>
          <div
            className="d0074"
            data-node-id="247:2"
            data-name="Видео внутри заголовка / Жираф / autoplay muted loop playsinline / source: https://disk.yandex.ru/i/3I6bF1tor29sbg"
          >
            <LazyVideo
              src="/assets/video/giraffe.mp4"
              poster="/assets/lodge/giraffe-poster.webp"
              label="Жираф на сафари"
            />
          </div>
        </div>
        <p className="d0075" data-node-id="54:269">
          И САФАРИ
        </p>
        <p className="d0076" data-node-id="54:270">
          <span className="d0077">В ОДНОМ</span>
          <span className="d0078">{` `}</span>
          <span className="d0077">ПУТЕШЕСТВИИ</span>
        </p>
      </div>
      <div className="d0079" data-node-id="54:271" data-name="Отступ" />
      <div
        className="d0080"
        data-node-id="54:272"
        data-name="Короткий смысл и одна заметка"
      >
        <p className="d0081" data-node-id="54:273">
          Маршрут и темп строятся вокруг вас — а не вокруг готовой программы.
          Путешествие в Африку подарит вам лучшие впечатления в вашей жизни.
        </p>
        <div className="d0082" data-node-id="54:274">
          <div className="d0046">
            <div className="d0083" data-name="Одна handwritten-note">
              <p className="d0084" data-node-id="54:275">
                Команда на месте, опытные гиды, понятный порядок сопровождения
              </p>
              <div
                className="d0085"
                data-node-id="54:276"
                data-name="Один doodle / Волна"
              >
                <img
                  alt=""
                  decoding="async"
                  loading="lazy"
                  className="d0044"
                  src={imgDoodle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d0086" data-node-id="57:267">
          <div className="d0087">
            <div className="d0088" data-name="Doodle / Слон">
              <img
                alt=""
                decoding="async"
                loading="lazy"
                className="d0044"
                src={imgDoodle1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
