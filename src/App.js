import './index.css'

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline bg-teal-500 p-4 text-center text-sky-100">
        ENV: {process.env.NODE_ENV}
      </h1>
    </div>
  );
}

export default App;
