type NavButtonProps = {
    url: string
    children: any
    disabled?: boolean
    className?: string
  }
  
  const NavButton = (props: NavButtonProps) => {
    
    return <div className={"  text-sm text-center  font-semibold  " + (props.className||'')}>
  
              <a href={props.disabled? undefined : props.url} 
              className={
                props.disabled? "text-gray-400 w-24 block bg-gray-300   py-1 px-2 rounded-lg"
              : "text-white text-xs w-24 bg-gray-900/75 block hover:bg-gray-900  py-1 px-2 rounded-lg"}>
               {props.children}</a>
        </div>
  }

  export default NavButton