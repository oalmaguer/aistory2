import { useState } from "react";

export default function Story() {
  const [story, setStory] =
    useState(`En una noche oscura y tormentosa, los cielos se iluminaron con luces extrañas. Los habitantes de la pequeña ciudad de San Esteban, acostumbrados a las lluvias torrenciales, miraron al cielo con asombro y temor. Las luces formaban patrones que parecían comunicar un mensaje incomprensible.

Al día siguiente, un misterioso zumbido resonaba en el aire. Los dispositivos electrónicos fallaban, y una sensación de nerviosismo se apoderaba de todos. Los rumores sobre visitantes de otro mundo crecían, alimentados por avistamientos de figuras esbeltas y brillantes que se movían entre las sombras.

Una noche, el joven Mateo, intrigado por los extraños sucesos, decidió investigar. Se adentró en el bosque, donde las luces parecían concentrarse. Allí, oculto entre los árboles, presenció una reunión de seres alienígenas discutiendo en un idioma gutural y extraño. Mateo entendió, de alguna forma, que planeaban liberar un virus letal para acabar con la humanidad.

Aterrorizado, Mateo corrió de regreso al pueblo para advertir a todos. Pero, al llegar, se dio cuenta de que el silencio reinaba. Las luces brillaban intensamente sobre San Esteban, y en la plaza principal, todos los habitantes estaban inmóviles, con los ojos perdidos en el resplandor celestial. Mateo comprendió que ya era demasiado tarde.`);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate a story");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();
      setStory(data);
    } catch (err) {
      setError("Failed to generate story. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return <div></div>;
}
