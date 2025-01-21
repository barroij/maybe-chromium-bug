import React from 'react';

class FileDialogOpener {
  readonly fileInputRef: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>()
  onFileOpen: (file: File) => void = null!
  open(onFileOpen: (file: File) => void): void {
    this.onFileOpen = onFileOpen
    this.fileInputRef.current?.click()
  }
}

const theFileDialogOpener = new FileDialogOpener()

export const FileDialogOpenerComp =  ({ fileDialogOpener }: { fileDialogOpener: FileDialogOpener }) => {
    const handleChange = React.useCallback(
      (event: React.FormEvent<HTMLInputElement>): void => {
        const target = event.currentTarget
        if (target.files) {
          const file = target.files.item(0)
          if (file) {
            event.preventDefault()
            fileDialogOpener.onFileOpen?.(file)
          }
        }
        target.value = ''
      },
      [fileDialogOpener]
    )


    return (
        <dialog>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileDialogOpener.fileInputRef}
            accept={'.json'}
            onChange={handleChange}
          />
        </dialog>
    )
  }



function deepClone(input : any, path = ''):any {
  if (input === null) {
      return null
  }
  if (Array.isArray(input)) {
      return input.map((v, i) => deepClone(v, `${path}[${i}]`))
  }
  if (typeof input === 'object') {
      const keys = Object.keys(input)
      if (keys.length > 0) {
        const firstKey = keys[0]
        if (!(firstKey in input)) {
          throw new Error(`${keys[0]} not in Object ${JSON.stringify(input).substring(0, 50)}...`)
        }
      }

      const output:Record<string, any> = {}
      for (const key in input) {
          const inputValue = input[key]
          if (inputValue === undefined) {
              throw new Error(`undefined value for key ${key}`)
          }
          output[key] = deepClone(inputValue, `${path}[${key}]`)
      }
      return input
  }

  return input
}


function click() {
  theFileDialogOpener.open((file: File) => {
    const fileReader = new FileReader() // FileReader is browser only
    fileReader.onload = (): void => {
      if (fileReader.result && typeof fileReader.result === 'string') {
        const data = JSON.parse(fileReader.result)
        const cloned = deepClone(data)
        if (cloned) {
          alert('done without error !')
        }
      }
    }

    fileReader.readAsText(file, 'utf8')
  })
}


function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <header>
        <FileDialogOpenerComp fileDialogOpener={theFileDialogOpener}/>
        <p>
          <button onClick={() => click()}>Click Me</button>
        </p>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
