const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function removeDuplicates() {
  try {
    console.log('Fetching all centers...')
    const { data: allCenters, error: fetchError } = await supabase
      .from('centers')
      .select('*')
      .order('name')
    
    if (fetchError) throw fetchError

    console.log(`Found ${allCenters.length} total centers`)
    
    // Group by name to find duplicates
    const centersByName = {}
    allCenters.forEach(c => {
      if (!centersByName[c.name]) {
        centersByName[c.name] = []
      }
      centersByName[c.name].push(c)
    })

    // Find duplicates
    const toDelete = []
    for (const [name, centers] of Object.entries(centersByName)) {
      if (centers.length > 1) {
        console.log(`\n"${name}" has ${centers.length} copies. Keeping first, deleting ${centers.length - 1}`)
        // Keep first, delete rest
        toDelete.push(...centers.slice(1).map(c => c.id))
      }
    }

    if (toDelete.length === 0) {
      console.log('\nNo duplicates found!')
      process.exit(0)
    }

    console.log(`\nDeleting ${toDelete.length} duplicate records...`)
    
    // Delete members
    const { data: members } = await supabase
      .from('members')
      .select('id')
      .in('center_id', toDelete)
    if (members?.length) {
      console.log(`  - Deleting ${members.length} members`)
      await supabase.from('members').delete().in('id', members.map(m => m.id))
    }

    // Delete visitors
    const { data: visitors } = await supabase
      .from('visitors')
      .select('id')
      .in('center_id', toDelete)
    if (visitors?.length) {
      console.log(`  - Deleting ${visitors.length} visitors`)
      await supabase.from('visitors').delete().in('id', visitors.map(v => v.id))
    }

    // Delete bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id')
      .in('center_id', toDelete)
    if (bookings?.length) {
      console.log(`  - Deleting ${bookings.length} bookings`)
      await supabase.from('bookings').delete().in('id', bookings.map(b => b.id))
    }

    // Delete invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id')
      .in('center_id', toDelete)
    if (invoices?.length) {
      console.log(`  - Deleting ${invoices.length} invoices`)
      await supabase.from('invoices').delete().in('id', invoices.map(i => i.id))
    }

    // Delete tickets
    const { data: tickets } = await supabase
      .from('tickets')
      .select('id')
      .in('center_id', toDelete)
    if (tickets?.length) {
      console.log(`  - Deleting ${tickets.length} tickets`)
      await supabase.from('tickets').delete().in('id', tickets.map(t => t.id))
    }

    // Delete centers
    const { error: deleteError } = await supabase
      .from('centers')
      .delete()
      .in('id', toDelete)
    
    if (deleteError) throw deleteError

    console.log('\nDeleted duplicate centers')
    
    // Show final result
    const { data: finalCenters } = await supabase
      .from('centers')
      .select('*')
      .order('name')
    
    console.log(`\n✓ Final centers (${finalCenters.length}):`)
    finalCenters.forEach(c => console.log(`  • ${c.name} (${c.city})`))
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

removeDuplicates()
