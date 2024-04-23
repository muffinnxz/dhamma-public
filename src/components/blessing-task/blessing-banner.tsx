import Image from "next/image";

const BlessingBanner = () => {
    return ( 
        <div className="relative">
            <Image 
                src="/images/pray.jpeg" 
                alt="Praying" 
                className="w-full h-32 md:h-48 lg:h-64 xl:h-80 2xl:h-96 object-cover"
                fill
            />
            <div className="absolute top-1/2 left-20 w-full transform -translate-y-1/2">
                <h1 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-medium mb-5">BLESSING TASK</h1>
                {/* <h2 className="text-white text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium px-1">{"PLACES > BLESSING TASK"}</h2> */}
            </div>
        </div>
     );
}

export default BlessingBanner;