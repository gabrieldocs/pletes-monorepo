// FileExplorer.js

function FileExplorer({ filesAndFolders, onFileSelect }: any) {
  const handleFileClick = (file: any) => {
    if (file.type === 'file') {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <ul>
        {filesAndFolders.map((item: any) => (
          <li key={item.name} onClick={() => handleFileClick(item)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileExplorer;
