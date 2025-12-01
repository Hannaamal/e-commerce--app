import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card sx={{ boxShadow: 3, p: 2 }}>
      <CardContent>
        <Typography color="text.secondary">{label}</Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
