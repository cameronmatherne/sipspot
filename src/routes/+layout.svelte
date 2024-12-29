<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl">sipSpot</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
				class="btn btn-sm variant-ghost-surface"
				href="/"
				>
					Home
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/map"
				>
					Find a spot
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/profile"

				>
					My Profile
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
