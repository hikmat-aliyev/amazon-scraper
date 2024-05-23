import Image from "next/image"

interface Props {
  title: string, 
  iconSrc: string, 
  value: string,
}

const PriceInfoCard = ({ title, iconSrc, value}: Props) => {
  return (
    <div className={`price-info_card`}>
      <p className="text-base text-black-100">
        {title}
      </p>

      <div className="flex items-center justify-center w-fit gap-1">
        <Image 
          src={iconSrc}
          alt={title}
          width={24}
          height={24}
        />
        <p className="flex text-xl font-bold text-secondary" style={{ whiteSpace: 'nowrap' }}>{value}</p>
      </div>
    </div>
  )
}

export default PriceInfoCard