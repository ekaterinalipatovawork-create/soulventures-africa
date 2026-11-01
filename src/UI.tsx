import { useEffect, useRef, useState } from "react";
const links = [
  ["Индивидуальные туры", "https://soulventuresafrica.ru/tours/"],
  ["Групповые туры", "https://soulventuresafrica.ru/grouptours/"],
  ["О нас", "https://soulventuresafrica.ru/about/"],
  ["Отзывы", "#reviews"],
  ["Контакты", "#contacts"],
];
// Reuses the existing project's real Bitrix24 form and error/retry behavior.
function OriginalForm() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const h = host.current;
    if (!h) return;
    h.replaceChildren();
    setFailed(false);
    const s = document.createElement("script");
    s.dataset.b24Form = "inline/1/8wr0g4";
    s.dataset.skipMoving = "true";
    s.src = "https://cdn-ru.bitrix24.ru/b38892884/crm/form/loader_1.js";
    s.async = true;
    s.onerror = () => setFailed(true);
    h.appendChild(s);
    const timer = setTimeout(() => {
      if (!h.querySelector("form,iframe,.b24-form")) setFailed(true);
    }, 15000);
    return () => {
      clearTimeout(timer);
      h.replaceChildren();
    };
  }, [attempt]);
  return (
    <>
      <h2>Подобрать путешествие</h2>
      <div ref={host} className="original-form" />
      {failed && (
        <div role="alert">
          <p>Не удалось загрузить форму.</p>
          <button onClick={() => setAttempt((n) => n + 1)}>Повторить</button>
          <a href="https://wa.me/255750408232">Написать в WhatsApp</a>
        </div>
      )}
    </>
  );
}
export function UI() {
  const [dialog, setDialog] = useState<null | "form" | "menu">(null);
  const box = useRef<HTMLDialogElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const open = (event: MouseEvent) => {
      const el = (event.target as Element).closest("button,a,[data-action]");
      if (!el) return;
      const text = el.textContent || "";
      if (
        el.getAttribute("href")?.includes("#popup:myform") ||
        /Подобрать|СОБРАТЬ МОЙ|Создать свой маршрут|Обсудить путешествие|Начать путешествие|Оставить заявку/i.test(
          text,
        )
      ) {
        event.preventDefault();
        previous.current = el as HTMLElement;
        setDialog("form");
      } else if (/Меню/.test(text)) {
        event.preventDefault();
        previous.current = el as HTMLElement;
        setDialog("menu");
      }
    };
    document.addEventListener("click", open);
    return () => document.removeEventListener("click", open);
  }, []);
  useEffect(() => {
    if (dialog) box.current?.showModal();
    else if (box.current?.open) {
      box.current.close();
      previous.current?.focus();
    }
  }, [dialog]);
  return (
    <dialog
      ref={box}
      className={"dialog " + (dialog === "menu" ? "menu-dialog" : "")}
      onCancel={() => setDialog(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setDialog(null);
      }}
    >
      <div className="dialog-content">
        <button
          className="dialog-close"
          onClick={() => setDialog(null)}
          aria-label="Закрыть"
        >
          ×
        </button>
        {dialog === "form" ? (
          <OriginalForm />
        ) : (
          <nav aria-label="Меню">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setDialog(null)}>
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </dialog>
  );
}
