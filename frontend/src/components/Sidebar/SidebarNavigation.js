import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const navigationMenu=[
    {
        title:"Home",
        icon:<HomeIcon/>,
        path:"/"
    },
    {
        title:"Notifications",
        icon:<NotificationsIcon/>,
        path:"/notifications"
    },
    {
        title:"Lists",
        icon:<ListAltIcon/>,
        path:"/lists"
    },
    {
        title:"Communities",
        icon:<GroupIcon/>,
        path:"/communities"
    },
    {
        title:"Profile",
        icon:<AccountCircleIcon/>,
        path:"/profile"
    }
]