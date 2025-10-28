export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 bg-government-green text-white shadow-md z-40 h-16 flex items-center">
      <div className="px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex-shrink-0 flex items-center justify-center">
              <span className="text-government-green font-bold text-sm sm:text-xl">NG</span>
            </div>
            <div className="max-w-[180px] sm:max-w-none">
              <h1 className="text-sm sm:text-xl font-bold truncate">Driver ID System</h1>
              <p className="text-[10px] sm:text-xs text-green-100 truncate">FRSC</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
