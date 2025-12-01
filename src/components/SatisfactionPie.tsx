import { Card, CardContent, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SatisfactionPieProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#2563eb", "#d1d5db"];

export default function SatisfactionPie({ data }: SatisfactionPieProps) {
  return (
    <Card sx={{ boxShadow: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Satisfaction Rate
        </Typography>
        <Box sx={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Typography sx={{ textAlign: "center", fontSize: 22, fontWeight: "bold", mt: 1 }}>
          {data[0]?.value.toFixed(2)}%
        </Typography>
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          Based on Likes
        </Typography>
      </CardContent>
    </Card>
  );
}
