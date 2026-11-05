(function () {
  "use strict";

  function showStorageError(action, error) {
    console.error("UC11 browser storage operation failed:", action, error);
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", function () {
        showStorageError(action, error);
      }, { once: true });
      return;
    }

    let notice = document.getElementById("uc11-storage-warning");
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "uc11-storage-warning";
      notice.setAttribute("role", "alert");
      notice.setAttribute("aria-live", "assertive");
      notice.style.cssText = "position:fixed;z-index:10000;inset:auto 16px 16px;padding:14px 18px;background:#fff2d6;color:#352600;border:1px solid #9a6a00;border-radius:10px;box-shadow:0 6px 24px #0004;font:14px/1.5 system-ui,sans-serif";
      const message = document.createElement("span");
      message.textContent = "O navegador não permitiu acessar o armazenamento local. O progresso pode não ser salvo.";
      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.textContent = "Fechar";
      dismiss.style.cssText = "margin-left:12px;padding:6px 10px";
      dismiss.addEventListener("click", function () { notice.remove(); });
      notice.append(message, dismiss);
      document.body.append(notice);
    }
  }

  window.UC11Storage = Object.freeze({
    getItem: function (key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        showStorageError("read", error);
        return null;
      }
    },
    setItem: function (key, value) {
      try {
        window.localStorage.setItem(key, String(value));
        return true;
      } catch (error) {
        showStorageError("write", error);
        return false;
      }
    },
    removeItem: function (key) {
      try {
        window.localStorage.removeItem(key);
        return true;
      } catch (error) {
        showStorageError("remove", error);
        return false;
      }
    }
  });
})();
