import { useEffect } from "react";

export function useKey(key, action) {
  // Effect to globally listen to a keypress event
  // Placed here instead of App so that it won't work when MovieDetails component is unmounted
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
          // console.log("CLOSING");
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
