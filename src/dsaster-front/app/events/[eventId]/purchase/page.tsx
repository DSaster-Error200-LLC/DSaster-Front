import EventContent from "@/app/events/[eventId]/EventContent";

interface PurchasePageProps {
  readonly params: Promise<{ readonly eventId: string }>;
}

export default async function PurchasePage({
  params,
}: Readonly<PurchasePageProps>) {
  const { eventId } = await params;
  return <EventContent key={eventId} eventId={eventId} view="purchase" />;
}
