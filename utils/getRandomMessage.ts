const partialCompletionMessages = [
  "Tu cuerpo acaba de aplicar un hotfix de energía",
  "¡Tu RAM interna acaba de liberar espacio!",
  "Eso sí fue un buen commit a tu salud",
  "¡Vas por buen camino! Tu cuerpo ya te lo está agradeciendo.",
  "Eso fue mejor que un commit sin errores. ¡Vamos por el siguiente!",
  "Más cerca de la victoria. ¡No pares ahora!",
  "Ya saliste del modo reposo. ¡Sigamos con fuerza!"
];

const fullCompletionMessages = [
  "¡Eres el framework perfecto… en versión saludable!",
  "No hay deploy más exitoso que el de tu bienestar",
  "¡GG! Tu cuerpo y tu mente lo agradecen",
  "¡Misión cumplida! Tu cuerpo te manda un pull request de gratitud.",
  "¡3 de 3! Tu energía ahora corre en modo ultra rendimiento.",
  "Tu salud hoy hizo merge con tu productividad. ¡Buen trabajo!",
  "Ese fue tu mejor commit del día. ¡Y fue para ti mismo!",
  "Te ganaste un break con orgullo. ¡Qué gran forma de cuidarte!",
]

export function getRandomMessage(finalMessage = false) {
  const messages = finalMessage ? fullCompletionMessages : partialCompletionMessages
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
