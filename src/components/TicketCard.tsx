
import React from 'react';
import { cn } from '@/lib/utils';

type TicketCardProps = {
  number: string;
  status: 'available' | 'reserved' | 'purchased';
  ownerName?: string;
  ownerRg?: string;
  ownerPhone?: string;
  isSelected?: boolean;
  onClick?: () => void;
  displayMode?: 'compact' | 'full';
};

const TicketCard: React.FC<TicketCardProps> = ({
  number,
  status,
  ownerName,
  ownerRg,
  ownerPhone,
  isSelected = false,
  onClick,
  displayMode = 'compact'
}) => {
  // Determine background color based on status and selection
  const getBackgroundStyles = () => {
    if (displayMode === 'full') {
      return 'ticket';
    }
    
    if (status === 'available') {
      return isSelected 
        ? 'bg-orange text-white' 
        : 'bg-white hover:bg-gray-50 cursor-pointer';
    } else if (status === 'reserved') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    } else {
      return 'bg-green-100 text-green-800 border-green-300';
    }
  };
  
  // Get status text in Portuguese
  const getStatusText = () => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'reserved': return 'Reservado';
      case 'purchased': return 'Pago';
      default: return status;
    }
  };
  
  // Compact mode rendering (for ticket selection grid)
  if (displayMode === 'compact') {
    return (
      <div 
        className={cn(
          'border rounded-md p-2 text-center transition-all flex items-center justify-center',
          getBackgroundStyles(),
          {
            'opacity-60': status !== 'available',
            'cursor-pointer': status === 'available',
            'cursor-not-allowed': status !== 'available',
          }
        )}
        onClick={status === 'available' ? onClick : undefined}
      >
        <span className="text-sm font-medium">
          {number}
        </span>
      </div>
    );
  }
  
  // Full mode rendering (for detailed view)
  return (
    <div className="ticket rounded-lg overflow-hidden w-full max-w-xs">
      <div className="ticket-border p-4 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold font-montserrat">CASA RIFA MANIA</h3>
            <p className="text-sm text-white/80">SORTEIO: 01 CASA</p>
          </div>
          <div className="px-2 py-1 bg-white/20 rounded-md">
            <span className="font-bold font-montserrat">Nº {number}</span>
          </div>
        </div>
        
        <div className="space-y-2 bg-white/10 p-3 rounded-md">
          <div className="flex flex-col">
            <span className="text-xs text-white/70">Nome:</span>
            <span className="font-medium">{ownerName || '--------------------'}</span>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <span className="text-xs text-white/70">RG:</span>
              <div className="font-medium">{ownerRg || '----------'}</div>
            </div>
            <div className="flex-1">
              <span className="text-xs text-white/70">Tel:</span>
              <div className="font-medium">{ownerPhone || '----------'}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-xs">Valor: </span>
            <span className="font-bold text-sm">R$ 1,00</span>
          </div>
          <div className={cn(
            'px-3 py-1 rounded-sm text-xs font-bold',
            status === 'available' ? 'bg-green-500' : 
            status === 'reserved' ? 'bg-yellow-500' : 
            'bg-yellow-500'
          )}>
            {getStatusText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
