import Link from 'next/link';
import { ProgressChart } from '@/components/ProgressChart';
import { Avatar } from '@/components/Avatar';
import { confirmButtonStyle } from '@/components/Button';
import { getSeasonalChallenges } from '@/services/getSeasonalChallenges';
import { Challenges } from '@/components/Challenges';
import { DailyChallenges } from '@/components/DailyChallenges';

function formatThisWeekData(array: number[]) {
  const hoy = new Date();
  let dia = hoy.getUTCDay();
  dia = dia === 0 ? 6 : dia - 1;

  return array.slice(0, dia + 1);
}

export default async function Home() {
  const seasonalChallenges = await getSeasonalChallenges();

  return (
    <>
      <main className="min-h-screen">
        <section className="p-4 text-center mb-4 md:my-10 md:mb-14 lg:my-20 lg:mb-24">
          <h1 className="text-5xl my-4">Cuida tu Framework más importante</h1>
          <p className="font-bold text-blue-400">
            ¿Horas picando código sin moverte?
          </p>
          <p className="text-balance my-2 text-[#ffffff8a]">
            Hazle un commit a tu bienestar con retos diarios
          </p>
        </section>
        <section className='max-w-[900] mx-auto'>
          <h2 className="m-4 block text-gray-400 mt-2 text-xl lg:ml-0">Retos de temporada</h2>
          <Challenges challenges={seasonalChallenges} />
        </section>
        <section className="p-4 my-10 md:my-10 lg:p-0 lg:my-20 lg:mt-40 max-w-[720] mx-auto">
          <h2 className="text-center text-balance text-4xl lg:mb-20">
            Beneficios de unirte a nuestros retos diarios
          </h2>
          {/* Nuestros retos diarios te sacarán de la silla, sin sacarte del flow */}
          <ul className="grid gap-10 sm:grid-cols-2 text-left mt-10">
            <li className="flex gap-2">
              <span className="text-2xl">🪑</span>
              <div>
                <h3 className="font-semibold text-lg text-balance mb-2">
                  Menos tiempo sentado, más salud
                </h3>
                <p className="text-gray-400 text-balance">
                  Despéjate con pausas activas y dile adiós a las horas
                  infinitas en la silla.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-2xl">🏃‍♂️</span>
              <div>
                <h3 className="font-semibold text-lg text-balance mb-2">
                  Activa tu cuerpo sin perder el ritmo
                </h3>
                <p className="text-gray-400 text-balance">
                  Retos cortos y efectivos que puedes hacer entre commits.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-2xl">👀</span>
              <div>
                <h3 className="font-semibold text-lg text-balance mb-2">
                  Cuida tu vista y tu postura
                </h3>
                <p className="text-gray-400 text-balance">
                  Ejercicios visuales y físicos pensados para quienes viven
                  frente al monitor.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-2xl">🧘</span>
              <div>
                <h3 className="font-semibold text-lg text-balance mb-2">
                  Reduce el estrés sin desconectarte
                </h3>
                <p className="text-gray-400 text-balance">
                  Actividades mentales y de respiración para reiniciar tu mente
                  sin cerrar el editor.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-2xl">📆</span>
              <div>
                <h3 className="font-semibold text-lg text-balance mb-2 text-red-300">
                  5 Retos cada día
                </h3>
                <p className="text-gray-400 text-balance">
                  2 retos de temporada y 3 retos del día.
                  Lo puedes hacer durante tus pausas o al final del día. ¡Tú eliges!
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-lg text-balance mb-2">
                  Mejora tu concentración y enfoque
                </h3>
                <p className="text-gray-400 text-balance">
                  Unos minutos de movimiento pueden hacer más por tu
                  productividad que otra taza de café.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-2xl">💻</span>
              <div>
                <h3 className="font-semibold text-lg text-balance mb-2">
                  Hecho por y para developers
                </h3>
                <p className="text-gray-400 text-balance">
                  Sabemos lo que necesitas porque también pasamos horas en la PC.
                </p>
              </div>
            </li>
          </ul>
        </section>
        <section className="max-w-[900] mx-auto p-4 my-10 md:my-10 lg:my-20 lg:mt-40">
          <h2 className="text-center text-balance text-4xl mb-10 lg:mb-20">
            Revisa tu progreso semanal y comparte tus logros
          </h2>
          <div className="p-4 max-w-100 mx-auto">
            <Avatar user={{
              fullName: 'Fekilo',
              imageUrl: '/fekilo-user-circle.png',
            }} />
            <div className="flex gap-2 justify-center  my-4">
              <Link href={`/challenges/${seasonalChallenges?.[0]?.id}`} className={confirmButtonStyle}>
                Iniciar ahora
              </Link>
            </div>
            <div className="flex flex-col gap-10 mt-4">
              <ProgressChart thisWeekCount={formatThisWeekData([2,2,3,1,4,1,2])} lastWeekCount={[0,2,3,2,3,3,2]} />
            </div>
          </div>
        </section>
        <section className='p-4 my-10 md:my-10 lg:my-20'>
          <h2 className="text-center text-balance text-4xl mb-10 lg:mb-20">
            Retos del día
          </h2>
          <DailyChallenges />
        </section>
      </main>
    </>
  );
}
