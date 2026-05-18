

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <img
        src="https://www.shutterstock.com/image-vector/car-wheel-icon-vector-symbol-600nw-2657251317.jpg"
        alt="Alloy Wheel Loader"
        className="w-24 h-24 animate-spin-slow"
      />
      <p className="mt-4 text-red-600 text-lg font-medium">Loading...</p>
    </div>
  );
}
