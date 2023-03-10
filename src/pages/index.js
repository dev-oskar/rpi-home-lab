import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";

export default function Home() {

  const [sensorsData, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    // router.replace('/');
    setLoading(true);
    fetch('/api/get_stored_data')
      .then((res) => res.json())
      .then((data) => {
        setData(data.rows);
        setLoading(false);
      })
  }

  useEffect(() => {
    refreshData()
  }, []);


  const measureNow = () => {
    fetch('/api/take_measurement')
      .then(() => {
        refreshData();
      })
  };

  return (
    <>
      <Head>
        <title>Home Plant Lab</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className='flex justify-between h-full'>
          <p className='text-lg'>Raspberry Pi Home Lab</p>
          <p className='text-lg'>Camera Online</p>
          <p className='text-lg'>Readings</p>
          <p className='text-lg'>Settings</p>
        </div>
        <section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
          <div className="flex flex-col justify-center h-full">

            <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
              <header className="px-5 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-800">Recent Readings</div>
              </header>

              <div className="overflow-x-auto p-3">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2">
                        <div className="font-semibold text-left">Temperature</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-left">Humidity</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-left">Measure Date</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {isLoading && <tr><td>
                      Loading...
                    </td></tr>}
                    {!isLoading && sensorsData && sensorsData.length > 0 && sensorsData.map((item) => {
                      return <tr key={item.id}>
                        <td className='p-2'>
                          <div className="text-left font-medium text-gray-800">
                            {item.temperature}
                          </div>
                        </td>
                        <td className='p-2'>
                          <div className="text-left font-medium text-gray-800">
                            {item.humidity}
                          </div>
                        </td>
                        <td className='p-2'>
                          <div className="text-left font-medium text-gray-800">
                            {new Date(item.measure_date).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between font-bold space-x-4 text-2xl border-t border-gray-100 px-5 py-4">
                <button className='px-4 py-1 rounded-lg bg-slate-300 text-gray-800' onClick={measureNow}>Measure now</button>
                <div>
                  <p>Total</p>
                  <p className="text-blue-600">{sensorsData && sensorsData.length} readings</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}