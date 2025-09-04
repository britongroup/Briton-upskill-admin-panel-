// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { KyberNetwork, Messages2, Calendar1, Kanban, Profile2User, Bill, UserSquare, ShoppingBag,TicketDiscount,CallIncoming,People, BoxTime,Card, MessageQuestion, Teacher, Setting2, Book1, Book } from 'iconsax-react';

// icons
const icons = {
  applications: KyberNetwork,
  allcustomer: People,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  coupons : TicketDiscount,
  contact: CallIncoming,
  allorder: BoxTime,
  blogs: Card,
  faq: MessageQuestion,
  training: Teacher,
  service: Setting2,
  courses: Book



};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    // {
    //   id: 'chat',
    //   title: <FormattedMessage id="chat" />,
    //   type: 'item',
    //   url: '/apps/chat',
    //   icon: icons.chat,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'Contact',
    //   title: <FormattedMessage id="Contact" />,
    //   type: 'item',
    //   url: '/apps/contact',
    //   icon: icons.call,
    //   breadcrumbs: false
    // },











    // {
    //   id: 'calendar',
    //   title: <FormattedMessage id="calendar" />,
    //   type: 'item',
    //   url: '/apps/calendar',
    //   icon: icons.calendar
    // },
    // {
    //   id: 'kanban',
    //   title: <FormattedMessage id="kanban" />,
    //   type: 'item',
    //   icon: icons.kanban,
    //   url: '/apps/kanban/board'
    // },
    // {
    //   id: 'customer',
    //   title: <FormattedMessage id="Customer" />,
    //   type: 'collapse',
    //   icon: icons.customer,
    //   children: [
    //     {
    //       id: 'customer-list',
    //       title: <FormattedMessage id="All Customers" />,
    //       type: 'item',
    //       icon: icons.allcustomer,
    //       url: '/apps/customer/customer-list'
    //     },
        // {
        //   id: 'customer-card',
        //   title: <FormattedMessage id="cards" />,
        //   type: 'item',
        //   url: '/apps/customer/customer-card'
        // }
    //   ]
    // },
    // {
    //   id: 'invoice',
    //   title: <FormattedMessage id="invoice" />,
    //   url: '/apps/invoice/dashboard',
    //   type: 'collapse',
    //   icon: icons.invoice,
    //   breadcrumbs: true,
    //   children: [
    //     {
    //       id: 'create',
    //       title: <FormattedMessage id="create" />,
    //       type: 'item',
    //       url: '/apps/invoice/create'
    //     },
    //     // {
    //     //   id: 'details',
    //     //   title: <FormattedMessage id="details" />,
    //     //   type: 'item',
    //     //   url: '/apps/invoice/details/1'
    //     // },
    //     {
    //       id: 'list',
    //       title: <FormattedMessage id="list" />,
    //       type: 'item',
    //       url: '/apps/invoice/list'
    //     },
    //     // {
    //     //   id: 'edit',
    //     //   title: <FormattedMessage id="edit" />,
    //     //   type: 'item',
    //     //   url: '/apps/invoice/edit/1'
    //     // }
    //   ]
    // },
    // {
    //   id: 'profile',
    //   title: <FormattedMessage id="profile" />,
    //   type: 'collapse',
    //   icon: icons.profile,
    //   children: [
    //     {
    //       id: 'user-profile',
    //       title: <FormattedMessage id="user-profile" />,
    //       type: 'item',
    //       url: '/apps/profiles/user/personal',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'account-profile',
    //       title: <FormattedMessage id="account-profile" />,
    //       type: 'item',
    //       url: '/apps/profiles/account/basic'
    //     }
    //   ]
    // },

   
    // {
    //   id: 'allorder',
    //   title: <FormattedMessage id="All order" />,
    //   type: 'item',
    //   url: '/apps/allorder',
    //   icon: icons.allorder,
    //   breadcrumbs: false
    // },


    {
      id: 'allcourses',
      title: <FormattedMessage id="All Courses" />,
      type: 'item',
      url: '/apps/allcourses',
      icon: icons.courses,
      breadcrumbs: false
    },


    {
      id: 'allservices',
      title: <FormattedMessage id="All Services" />,
      type: 'item',
      url: '/apps/allservices',
      icon: icons.service,
      breadcrumbs: false
    },


    
    {
      id: 'alltraining',
      title: <FormattedMessage id="All Training" />,
      type: 'item',
      url: '/apps/alltraining',
      icon: icons.training,
      breadcrumbs: false
    },




    {
      id: 'contactus',
      title: <FormattedMessage id="Contact Us" />,
      type: 'item',
      url: '/apps/contactus',
      icon: icons.contact,
      breadcrumbs: false
    },

    {
      id: 'faq',
      title: <FormattedMessage id="Faq" />,
      type: 'item',
      url: '/apps/faq',
      icon: icons.faq,
      breadcrumbs: false
    },
    // {
    //   id: 'allcoupons',
    //   title: <FormattedMessage id="All Coupons" />,
    //   type: 'item',
    //   url: '/apps/allcoupons',
    //   icon: icons.coupons,
    //   breadcrumbs: false
    // },
    {
      id: 'blog',
      title: <FormattedMessage id="Blog" />,
      type: 'item',
      url: '/apps/blog',
      icon: icons.blogs,
      breadcrumbs: false
    },

    {
      id: 'enquiry',
      title: <FormattedMessage id="Enquiry" />,
      type: 'item',
      url: '/apps/enquiries',
      icon: icons.blogs,
      breadcrumbs: false
    },

    // {
    //   id: 'faq',
    //   title: <FormattedMessage id="Faqs" />,
    //   type: 'item',
    //   url: '/apps/faq',
    //   icon: icons.blogs
    // }
  ]
};

export default applications;
