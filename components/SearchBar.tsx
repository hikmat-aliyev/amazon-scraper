"use client";
import { FormEvent, useState } from "react";

const isValidProductUrl = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url; // Prepend 'https://' if scheme is missing
  }
  console.log(url.toString())
  const parsedUrl = new URL(url.toString());
  console.log(parsedUrl)

  return false;
}

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidProductUrl(searchPrompt);
    alert(isValidLink ? 'Valid link' : 'Invalid link')
  }

  return (
    <form 
      className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link" 
        className="searchbar-input"
      />
      <button type="submit" className="searchbar-btn">Search</button>
    </form>
  )
}

export default SearchBar