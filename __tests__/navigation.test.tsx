import { render, screen } from '@testing-library/react'
import { Navigation } from '@/components/Navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname() {
    return '/'
  },
}))

describe('Navigation', () => {
  it('renders all navigation links', () => {
    render(<Navigation />)
    
    // Check if the home link is rendered
    const homeLink = screen.getByLabelText('Home')
    expect(homeLink).toBeInTheDocument()
    
    // Check if dashboard link is rendered
    const dashboardLink = screen.getByLabelText('Dashboard')
    expect(dashboardLink).toBeInTheDocument()
    
    // Check if advisor link is rendered
    const advisorLink = screen.getByLabelText('Advisor')
    expect(advisorLink).toBeInTheDocument()
  })
})
