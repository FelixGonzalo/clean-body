import { TodayChallenges } from '@/components/TodayChallenges';
import { getTodayChallenges } from '@/services/getTodayChallenges';
import Link from 'next/link';
import { GithubIcon } from '@/components/icons/github-icon';
import { ProgressChart } from '@/components/ProgressChart';
import { Avatar } from '@/components/Avatar';
import { confirmButtonStyle } from '@/components/Button';

function formatThisWeekData(array: number[]) {
  const hoy = new Date();
  let dia = hoy.getDay();
  dia = dia === 0 ? 6 : dia - 1;

  return array.slice(0, dia + 1);
}

export default async function Home() {
  const challenges = await getTodayChallenges();

  return (
    <>
      <main className="min-h-screen">
        <section className="p-4 text-center mb-4 md:my-10 md:mb-14 lg:my-20 lg:mb-24">
          <h1 className="text-5xl my-4">Cuida tu framework más importante</h1>
          <p className="font-bold text-blue-400">
            ¿Horas picando código sin moverte?
          </p>
          <p className="text-balance my-2 text-[#ffffff8a]">
            Hazle un commit a tu bienestar con retos diarios
          </p>
        </section>
        <section className='max-w-[900] mx-auto'>
          <h2 className="m-4 block text-gray-400 mt-2 text-xl lg:ml-0">Retos del día</h2>
          <TodayChallenges challenges={challenges} />
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
                <h3 className="font-semibold text-lg text-balance mb-2">
                  Tres retos cada día
                </h3>
                <p className="text-gray-400 text-balance">
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
                  Hecho por y para programadores
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
              imageUrl: 'https://avatars.githubusercontent.com/u/102646648?v=4',
            }} />
            <div className="flex gap-2 justify-center  my-4">
              <Link href={`/challenges/${challenges?.[0]?.id}`} className={confirmButtonStyle}>
                Iniciar ahora
              </Link>
            </div>
            <div className="flex flex-col gap-10 mt-4">
              <ProgressChart thisWeekCount={formatThisWeekData([2,2,3,1,4,1,2])} lastWeekCount={[1,3,2,2,3,3,0]} />
            </div>
          </div>
        </section>
      </main>
      <footer className="p-4 pb-10 pt-20 max-w-[900] mx-auto flex justify-between items-center lg:px-0">
        <Link
          href={'https://github.com/FelixGonzalo/clean-body'}
          target="_blank"
          className="hover:scale-110 duration-200"
        >
          <GithubIcon />
        </Link>
        <p className="text-sm text-gray-300">
          Built by{' '}
          <Link
            href={'https://github.com/FelixGonzalo'}
            target="_blank"
            className="hover:text-blue-200"
          >
            Felix Castro
          </Link>
        </p>
      </footer>
    </>
  );
}
