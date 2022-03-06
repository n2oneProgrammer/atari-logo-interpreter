class Popup {

  static #pop = document.getElementById('popup');

  static show(message, time = 1500) {
    Popup.#pop.textContent = message;
    Popup.#pop.style.transform = 'translateX(0)';
    setTimeout(() => Popup.#pop.style.transform = 'translateX(-200%)', time);
  }
}

export default Popup;
