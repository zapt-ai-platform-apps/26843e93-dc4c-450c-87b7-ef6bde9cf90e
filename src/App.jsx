import { createSignal, createEffect, onMount, Show, For } from 'solid-js'
import { supabase, createEvent } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-solid'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { SolidMarkdown } from "solid-markdown"

function App() {
  const [user, setUser] = createSignal(null)
  const [currentPage, setCurrentPage] = createSignal('login')
  const [loading, setLoading] = createSignal(false)
  const [results, setResults] = createSignal([])
  const [minPrice, setMinPrice] = createSignal('')
  const [maxPrice, setMaxPrice] = createSignal('')
  const [location, setLocation] = createSignal('')
  const [growthTarget, setGrowthTarget] = createSignal('')
  const [industry, setIndustry] = createSignal('')

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setCurrentPage('homePage')
    }
  }

  onMount(checkUserSignedIn)

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user)
        setCurrentPage('homePage')
      } else {
        setUser(null)
        setCurrentPage('login')
      }
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  })

  const handleFindCompanies = async () => {
    setLoading(true)
    setResults([])
    try {
      const prompt = `
        Provide the top 3 target companies to buy based on the following criteria:
        - Purchase Price Range: $${minPrice()} to $${maxPrice()}
        - Location: ${location()}
        - Growth Target Percentage: ${growthTarget()}%
        - Industry: ${industry()}
        Return the response as a JSON array of objects with the following structure:
        {
          "company_name": "",
          "purchase_price": "",
          "location": "",
          "expected_growth": "",
          "industry": ""
        }
      `
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'json'
      })
      setResults(result)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-center">Sign in with ZAPT</h2>
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline mb-4 block text-center">
              Learn more about ZAPT
            </a>
            <Auth 
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'facebook', 'apple']}
            />
          </div>
        }
      >
        <div class="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Private Equity Target Finder</h1>
            <button
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block mb-2 font-semibold">Minimum Purchase Price ($)</label>
              <input
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded box-border"
                value={minPrice()}
                onInput={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label class="block mb-2 font-semibold">Maximum Purchase Price ($)</label>
              <input
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded box-border"
                value={maxPrice()}
                onInput={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div>
              <label class="block mb-2 font-semibold">Location</label>
              <input
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded box-border"
                value={location()}
                onInput={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label class="block mb-2 font-semibold">Growth Target Percentage (%)</label>
              <input
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded box-border"
                value={growthTarget()}
                onInput={(e) => setGrowthTarget(e.target.value)}
              />
            </div>
            <div class="md:col-span-2">
              <label class="block mb-2 font-semibold">Industry</label>
              <input
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded box-border"
                value={industry()}
                onInput={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>
          <button
            class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            onClick={handleFindCompanies}
            disabled={loading()}
          >
            <Show when={loading()}>Loading...</Show>
            <Show when={!loading()}>Find Target Companies</Show>
          </button>
          <Show when={results().length > 0}>
            <div class="mt-6">
              <h2 class="text-2xl font-bold mb-4">Top 3 Target Companies</h2>
              <For each={results()}>
                {(company) => (
                  <div class="p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 class="text-xl font-semibold mb-2">{company.company_name}</h3>
                    <p><strong>Purchase Price:</strong> {company.purchase_price}</p>
                    <p><strong>Location:</strong> {company.location}</p>
                    <p><strong>Expected Growth:</strong> {company.expected_growth}%</p>
                    <p><strong>Industry:</strong> {company.industry}</p>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default App