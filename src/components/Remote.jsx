import Image from "next/image";

export default function Remote() {
  return (
    <div>
        <div className="flex gap-4 p-4">
            <button id="power" className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 hover:bg-red-400 transition-colors">
                <Image src="/power.svg" alt="Power" width={24} height={24} loading="eager" />
            </button>

            <button id="refresh" className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-200 transition-colors">
                <Image src="/refresh.svg" alt="Refresh" width={24} height={24} />
            </button>

            <button id="pause/play" className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-200 transition-colors">
                <Image src="/play.svg" alt="Pause/Play" width={24} height={24} />
            </button>

            <button id="full screen/exit full screen" className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-200 transition-colors">
                <Image src="/full%20screen.svg" alt="Full screen" width={24} height={24} />
            </button>
        </div>
    </div>
  );
}
