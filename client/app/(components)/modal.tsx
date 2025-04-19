import { FC } from "react";

type ModalProps = {
  result: Row[];
  setModalOpen: (open: boolean) => void;
};

const Modal: FC<ModalProps> = ({ result, setModalOpen }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl w-3/4 h-3/4 flex flex-col justify-between text-black">
        <h2 className="text-2xl font-bold mb-4">SQL Query Result</h2>
        <div className="overflow-auto">
          {result.length !== 0 ? <Table result={result} /> : "No results found"}
        </div>
        <button
          className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 cursor-pointer mt-4 w-fit"
          onClick={() => setModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Table = ({ result }: { result: Row[] }) => {
  return (
    <table className="w-full border-collapse text-black">
      <thead>
        <tr>
          {Object.keys(result[0]).map((key) => (
            <th key={key} className="border p-2 bg-gray-200">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {result.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, index) => (
              <td key={index} className="border p-2">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Modal;
