'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileCheck2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type DropzoneProps = {
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  optional?: boolean;
};

export function Dropzone({ label, hint, accept, file, onChange, optional }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files[0]) onChange(files[0]);
    },
    [onChange]
  );

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-sm font-medium">{label}</label>
        {optional && <span className="text-xs text-muted-foreground">(opcional)</span>}
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {file ? (
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileCheck2 className="h-5 w-5 text-primary" />
            {file.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="h-7 w-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arraste o arquivo aqui ou <span className="text-primary underline">clique para selecionar</span>
            </p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}
