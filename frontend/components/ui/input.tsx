import clsx from 'clsx';
import React from 'react';
export function Input(props:React.InputHTMLAttributes<HTMLInputElement>){return <input {...props} className={clsx('w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-600', props.className)} />;}
