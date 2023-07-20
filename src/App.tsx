import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

export default function App() {
	const transcriber = useTranscriber();

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<div className='container flex flex-col justify-center items-center'>
				<h1 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-7xl text-center'>
					Lecture Master
				</h1>
				<h2 className='mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight text-slate-900 sm:text-2xl'>
					Makes watching lectures more efficient!
				</h2>
				<AudioManager transcriber={transcriber} />
				<Transcript transcribedData={transcriber.output} />
			</div>

			<div className='absolute bottom-4'>
				Developed by{" "}
				<a
					className='underline'
					href='https://github.com/phoenixpereira'
					target="blank"
				>
					Phoenix Pereira
				</a>
			</div>

		</div>
	);
}
