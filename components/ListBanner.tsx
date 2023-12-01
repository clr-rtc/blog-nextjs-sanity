type ListBannerProps = {
    children: any
    highlight?: boolean
  }
  
  export const ListBanner = (props: ListBannerProps) => {
    return  (<div className={`py-1  ${props.highlight? 'bg-amber-200' : 'bg-gray-300'} text-center  text-xl tracking-[0.35em] font-semibold  md:text-xl`}>
    {props.children}
  </div>  ) 
  }
  
  export default ListBanner