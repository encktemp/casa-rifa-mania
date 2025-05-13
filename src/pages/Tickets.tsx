import React, { useState, useEffect } from "react";
import { createPayment } from "../api/api";
import axios from "axios";
import Layout from "@/components/Layout";
import { useRaffle } from "@/contexts/RaffleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import TicketCard from "@/components/TicketCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

const Tickets = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    tickets,
    toggleTicketSelection,
    selectedTickets,
    clearSelectedTickets,
    purchaseTickets,
    reserveTickets,
    isLoading,
    totalValue,
  } = useRaffle();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [endDigitFilter, setEndDigitFilter] = useState<string | null>(null);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentTab, setPaymentTab] = useState("pix");
  const [pixCopyPaste, setPixCopyPaste] = useState("00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000");
  const [pixQRCode, setPixQRCode] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter((ticket) => {
    // Search filter
    if (searchQuery && !ticket.number.includes(searchQuery)) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false;
    }

    // End digit filter
    if (endDigitFilter !== null && !ticket.number.endsWith(endDigitFilter)) {
      return false;
    }

    // Selected filter
    if (showOnlySelected && !selectedTickets.includes(ticket.number)) {
      return false;
    }

    return true;
  });

  // Button actions
  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (selectedTickets.length === 0) {
      return;
    }

    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    try {
      const response = await axios.post("/api/create-payment", {
        amount: totalValue,
        // outros dados necessários
      });

      console.log("Pagamento criado:", response.data);

      // Aqui você pode adicionar a lógica para confirmar a compra
      purchaseTickets();
      setShowPaymentDialog(false);
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      // Aqui você pode exibir um alerta de erro para o usuário
    }
  };

  // Calculate summary
  const totalSelectedTickets = selectedTickets.length;

  // Group tickets by first digit for easier navigation
  const ticketGroups = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
    const start = digit * 100;
    const end = start + 99;
    const available = filteredTickets.filter((t) => {
      const num = parseInt(t.number);
      return num >= start && num <= end && t.status === "available";
    }).length;

    return {
      digit,
      start: start.toString().padStart(3, "0"),
      end: end.toString().padStart(3, "0"),
      available,
    };
  });

  return (
    <Layout>
      {/* Header */}
      <div className="">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            Bilhetes Disponíveis
          </h1>
          <p className="text-white/80 mt-2">
            Escolha seus números da sorte e concorra a uma casa!
          </p>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="sticky top-0 z-10 bg-white shadow-md py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-gray-600">Selecionados:</span>
              <span className="font-bold ml-2">
                {totalSelectedTickets} bilhetes
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-bold ml-2">
                R$ {totalValue.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="flex gap-2">
              {selectedTickets.length > 0 && (
                <Button variant="outline" onClick={clearSelectedTickets}>
                  Limpar Seleção
                </Button>
              )}

              <Button
                className="bg-orange hover:bg-orange-dark"
                onClick={handleBuyClick}
                disabled={selectedTickets.length === 0 || isLoading}
              >
                {isLoading ? "Processando..." : "Comprar Agora"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por número..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="available">Disponíveis</SelectItem>
                    <SelectItem value="reserved">Reservados</SelectItem>
                    <SelectItem value="purchased">Vendidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <Select
                  value={endDigitFilter || "all"}
                  onValueChange={(value) =>
                    setEndDigitFilter(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Final do número" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os finais</SelectItem>
                    {Array.from({ length: 10 }, (_, i) => i).map((digit) => (
                      <SelectItem key={digit} value={digit.toString()}>
                        Final {digit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="showSelected"
                checked={showOnlySelected}
                onCheckedChange={(checked) =>
                  setShowOnlySelected(checked === true)
                }
              />
              <Label htmlFor="showSelected" className="ml-2">
                Mostrar apenas selecionados
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Group Navigation */}
      <div className="bg-white py-4 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex space-x-2">
            {ticketGroups.map((group) => (
              <Button
                key={group.digit}
                variant="outline"
                size="sm"
                className="min-w-[100px]"
                onClick={() => setSearchQuery(group.digit.toString())}
              >
                {group.start}-{group.end}
                <span className="ml-2 text-xs bg-purple/10 text-purple rounded-full px-2">
                  {group.available}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 md:gap-3">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.number}
                number={ticket.number}
                status={ticket.status}
                ownerName={ticket.ownerName}
                ownerPhone={ticket.ownerPhone}
                ownerRg={ticket.ownerRg}
                isSelected={selectedTickets.includes(ticket.number)}
                onClick={() => toggleTicketSelection(ticket.number)}
              />
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhum bilhete encontrado com os filtros aplicados.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setEndDigitFilter(null);
                  setShowOnlySelected(false);
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
            <DialogDescription>
              Você está comprando {totalSelectedTickets} bilhete(s) por R${" "}
              {totalValue.toFixed(2).replace(".", ",")}.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={paymentTab} onValueChange={setPaymentTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="pix">PIX</TabsTrigger>
              <TabsTrigger value="card">Cartão</TabsTrigger>
            </TabsList>

            {/* PIX */}
            <TabsContent value="pix" className="space-y-4">
              <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
                  {pixQRCode ? (
                    <img
                      src={`data:image/png;base64,${pixQRCode}`}
                      alt="QR Code do PIX"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      QR Code PIX
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Escaneie o QR Code ou copie a chave PIX abaixo:
                </p>
                <div className="flex w-full mt-2 mb-4">
                  <Input
                    readOnly
                    value={pixCopyPaste || ""}
                    className="bg-white"
                  />
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      if (pixCopyPaste) {
                        navigator.clipboard.writeText(pixCopyPaste);
                        toast({
                          title: "Código Copiado",
                          description: "A chave PIX foi copiada para a área de transferência.",
                        });
                      }
                    }}
                    disabled={!pixCopyPaste}
                  >
                    Copiar
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Após o pagamento, seus bilhetes serão automaticamente
                  confirmados em até 1 minuto.
                </p>
                {/* Notificação de sucesso após pagamento PIX validado */}
                {paymentSuccess && (
                  <div className="flex flex-col items-center mt-4">
                    <div className="rounded-full bg-green-500 w-16 h-16 flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-green-600 font-bold text-lg">Pagamento aprovado!</span>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Cartão */}
            <TabsContent value="card" className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Preencha os dados do seu cartão para finalizar a compra:
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Validade</Label>
                    <Input id="expiry" placeholder="MM/AA" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input id="cardName" placeholder="Como está no cartão" />
                </div>
              </div>
              {/* Botão Confirmar Pagamento só na aba Cartão */}
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  className="bg-orange hover:bg-orange-dark"
                >
                  {isLoading ? "Processando..." : "Confirmar Pagamento"}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Tickets;
