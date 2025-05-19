import {TodayChallenges} from "@/components/TodayChallenges";
import { getTodayChallenges } from "@/services/getTodayChallenges";

export default async function Home() {
  const challenges = await getTodayChallenges()

  return (
    <>
      <main className="min-h-screen">
        <div className="p-4 text-center mb-4 md:my-10 md:mb-14 lg:my-20 lg:mb-24">
          <h1 className="text-5xl my-4">Cuida tu framework más importante</h1>
          <p className="font-bold text-blue-400">
            ¿Horas picando código sin moverte?
          </p>
          <p className="text-balance my-2 text-[#ffffff8a]">
            Hazle un commit a tu bienestar con nuestros <span className="block">retos diarios</span>
          </p>
        </div>
        <TodayChallenges challenges={challenges} />
      </main>
      <footer className="text-center p-4 pb-10 pt-20">
        <p>Creado con 20 sentadillas, 10 planchas y 10 movimientos de cabeza por Felix Castro</p>
      </footer>
    </>
  );
}
