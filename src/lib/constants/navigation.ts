// src/lib/constants/navigation.ts
export const mainNavItems = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Schools', href: '/schools' },
  { title: 'Academics', href: '/academics' },
  { title: 'Admissions', href: '/admissions' },
  { title: 'News', href: '/news' },
  { title: 'Contact', href: '/contact' },
  // Make sure there's NO '/login' here
]

export const footerNavItems = {
  academics: [
    { title: 'Curriculum', href: '/academics/curriculum' },
    { title: 'Calendar', href: '/academics/calendar' },
    { title: 'Results', href: '/academics/results' },
    { title: 'Library', href: '/academics/library' },
  ],
  about: [
    { title: 'Our Story', href: '/about/story' },
    { title: 'Mission & Vision', href: '/about/mission' },
    { title: 'Leadership', href: '/about/leadership' },
    { title: 'Facilities', href: '/about/facilities' },
  ],
  portal: [
    { title: 'Student Portal', href: '/portal/student' },
    { title: 'Parent Portal', href: '/portal/parent' },
    { title: 'Staff Portal', href: '/portal/staff' },
    // Make sure there's NO '/login' here either
  ],
}