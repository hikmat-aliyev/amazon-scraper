'use client';
import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const isValidProductUrl = (url: string) => {

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url; // Prepend 'https://' if scheme is missing
  }

  try {
    const parsedUrl = new URL(url);
    const hostName = parsedUrl.hostname;
    if(hostName.includes('amazon.com') || hostName.includes('amazon.')){
      return true;
    }
  }catch(error) {
    console.log(error);
    return false;
  }

  return false;
};

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidProductUrl(searchPrompt);
    if(!isValidLink) return alert('Please provide a valid Amazon link');

    try {
      setIsLoading(true);

      //scrape the product
      const productUrl = await scrapeAndStoreProduct(searchPrompt);
      
      //redirect to product page
      if(productUrl){
        router.push(productUrl);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

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
      <button 
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ''}>
        {isLoading ? 'Searching' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;