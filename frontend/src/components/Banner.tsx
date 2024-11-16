export default function Banner({ text }: { text: string }) {
    return (
      <div className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">{text}</h2>
        </div>
      </div>
    )
  }