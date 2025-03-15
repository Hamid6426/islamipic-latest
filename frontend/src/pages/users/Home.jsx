export default function Home() {
  return (
    <div>
      <main>
        <div className="p-6 grid grid-cols-3 gap-x-6">
          <div className="flex flex-col justify-start items-center gap-y-6">
            <img src="image-1.png" alt="image" className="" />
            <img src="image-2.png" alt="image" className="" />
            <img src="image-1.png" alt="image" className="" />
          </div>
          <div className="flex flex-col justify-start items-center gap-y-6">
            <img src="image-2.png" alt="image" className="" />
            <img src="image-1.png" alt="image" className="" />
            <img src="image-2.png" alt="image" className="" />
            <img src="image-2.png" alt="image" className="" />
          </div>
          <div className="flex flex-col justify-start items-center gap-y-6">
            <img src="image-1.png" alt="image" className="" />
            <img src="image-2.png" alt="image" className="" />
            <img src="image-1.png" alt="image" className="" />
          </div>
        </div>
      </main>
    </div>
  );
}
